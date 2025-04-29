from rest_framework.views import APIView
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action, api_view, permission_classes
from django.utils import timezone
from .models import Attendance, LeaveRequest
from .serializers import AttendanceSerializer, LeaveRequestSerializer
from datetime import datetime
import csv
from django.http import HttpResponse
from django.core.files.base import ContentFile
import base64



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attendance_records(request):
    user = request.user
    month = int(request.GET.get('month', datetime.now().month))
    year = int(request.GET.get('year', datetime.now().year))

    records = Attendance.objects.filter(
        user=user,
        date__month=month,
        date__year=year
    )
    serializer = AttendanceSerializer(records, many=True)
    return Response(serializer.data)

class PunchInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        now = timezone.now().time()
        photo_data = request.data.get('photo')
        location = request.data.get('location') 

        if not location:
            return Response({"message": "Location is required."}, status=400)

        attendance, created = Attendance.objects.get_or_create(
            user=request.user,
            date=today,
            defaults={'punch_in': now, 'location': location, 'punch_in_status': 'pending',}
        )

        if not created:
            return Response({"message": "You have already punched in today."}, status=400)

        if photo_data:
            try:
                format, imgstr = photo_data.split(';base64,')
                ext = format.split('/')[-1]
                filename = f"{request.user.username}_{today}_in.{ext}"
                decoded_img = base64.b64decode(imgstr)
                attendance.punch_in_photo = ContentFile(decoded_img, name=filename)
            except Exception as e:
                return Response({"message": "Error Occured!", "details": str(e)}, status=400)
        else:
            return Response({"message": "Photo is missing or not base64 encoded"}, status=400)

        attendance.save()
        return Response({"message": "Punch-in recorded and sent for approval.", "time": str(now)})


class PunchOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        now = timezone.now().time()
        photo_data = request.data.get('photo')
        location = request.data.get('location')

        try:
            attendance = Attendance.objects.get(user=request.user, date=today)
        except Attendance.DoesNotExist:
            return Response({"message": "No punch-in record found for today."}, status=404)

        if attendance.punch_out:
            return Response({"message": "You already punched out today."}, status=400)

        attendance.punch_out = now

        if photo_data:
            try:
                format, imgstr = photo_data.split(';base64,')
                ext = format.split('/')[-1]
                filename = f"{request.user.username}_{today}_out.{ext}"
                decoded_img = base64.b64decode(imgstr)
                attendance.punch_out_photo = ContentFile(decoded_img, name=filename)
            except Exception as e:
                return Response({"message": "Error occured", "details": str(e)}, status=400)
        
        attendance.save()
        return Response({"message": "Punched out!", "time": str(now)})


class ApplyLeaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LeaveRequestSerializer(data=request.data)
        if serializer.is_valid():
            leave = serializer.save(user=request.user)
            leave.date_applied = datetime.now().date()
            leave.save()
            new_serializer = LeaveRequestSerializer(leave)
            return Response({'message': 'Leave request submitted successfully.', 'data': new_serializer.data}, status=201)
        else:
            print("❌ Validation error:", serializer.errors)
            return Response(serializer.errors, status=400)

class MyLeaveRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month = request.GET.get('month')
        year = request.GET.get('year')

        leaves = LeaveRequest.objects.filter(user=user)

        if month and year:
            leaves = leaves.filter(start_date__month=month, start_date__year=year)

        serializer = LeaveRequestSerializer(leaves.order_by('-date'), many=True)
        return Response(serializer.data)

class ExportMyAttendanceCSV(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            month = int(request.GET.get('month'))
            year = int(request.GET.get('year'))
        except (TypeError, ValueError):
            return Response({"message": "Invalid month or year"}, status=400)

        records = Attendance.objects.filter(user=request.user, date__month=month, date__year=year)
        if month and year:
            records = records.filter(date__month=month, date__year=year)

        response = HttpResponse(content_type='text/csv')
        filename = f"{request.user.username}_attendance.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)
        writer.writerow(['Date', 'Punch In', 'Punch Out', 'Location'])

        for record in records:
            writer.writerow([
                record.date,
                record.punch_in or '—',
                record.punch_out or '—',
                record.location or '—'
            ])

        return response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def attendance_requests_view(request):
    requests = Attendance.objects.filter(punch_in_status='pending')
    serializer = AttendanceSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_attendance_status(request, pk):
    try:
        attendance = Attendance.objects.get(pk=pk)
    except Attendance.DoesNotExist:
        return Response({"error": "Attendance not found."}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')  # 'approve' or 'reject'
    target = request.data.get('target')  # 'punch_in' or 'punch_out'

    if target == 'punch_in':
        attendance.punch_in_status = 'APPROVED' if action == 'approve' else 'REJECTED'
    else:
        return Response({"error": "Invalid target."}, status=400)

    attendance.save()
    return Response({"message": f"{target.replace('_', ' ').title()} {action}d successfully."})


class AttendanceByUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        month = request.GET.get('month')
        year = request.GET.get('year')

        attendance = Attendance.objects.filter(user_id=user_id)

        if month and year:
            attendance = attendance.filter(
                date__month=month,
                date__year=year
            )

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)


class UpdateAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, attendance_id):
        try:
            attendance = Attendance.objects.get(id=attendance_id)
        except Attendance.DoesNotExist:
            return Response({'error': 'Attendance not found.'}, status=404)

        action = request.data.get('action')

        if action == 'present':
            attendance.punch_in = timezone.now().replace(hour=10, minute=0, second=0)
            attendance.punch_out = timezone.now().replace(hour=17, minute=0, second=0)
        elif action == 'absent':
            attendance.punch_in = None
            attendance.punch_out = None
        elif action == 'half-day':
            attendance.punch_in = timezone.now().replace(hour=10, minute=0, second=0)
            attendance.punch_out = timezone.now().replace(hour=13, minute=0, second=0)
        elif action == 'leave':
            attendance.punch_in = None
            attendance.punch_out = None
            attendance.location = "On Leave"
        else:
            return Response({'error': 'Invalid action'}, status=400)

        attendance.save()
        return Response({'message': 'Attendance updated successfully.'})


class AdminExportAttendanceView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        month = request.GET.get('month')
        year = request.GET.get('year')
        employee_id = request.GET.get('employee_id')

        if not (month and year and employee_id):
            return Response({'error': 'Month, Year, and Employee ID are required.'}, status=400)

        try:
            records = Attendance.objects.filter(
                user__id=employee_id,
                date__month=month,
                date__year=year
            )
        except:
            return Response({'error': 'Invalid data.'}, status=400)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="attendance_{employee_id}_{month}_{year}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Date', 'Punch In', 'Punch Out', 'Location', 'Punch-In Status'])

        for record in records:
            writer.writerow([
                record.date,
                record.punch_in if record.punch_in else 'N/A',
                record.punch_out if record.punch_out else 'N/A',
                record.location if record.location else 'N/A',
                record.punch_in_status,
            ])

        return response