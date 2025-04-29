from rest_framework import generics, status
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser


User = get_user_model()

class RegisterEmployeeView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        data = request.data
        User = get_user_model()

        try:
            user = User.objects.create_user(
                username = data['username'],
                email = data['email'],
                first_name = data['first_name'],
                last_name = data['last_name'],
                password = data['password'],
                designation = data.get('designation', '')
            )
            role = data.get('role', 'EMPLOYEE'),

            if user.role == 'ADMIN':
                user.is_staff = True
            else:
                user.is_staff = False

            user.save()

            return Response({'message': 'Employee registered successfully.'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]