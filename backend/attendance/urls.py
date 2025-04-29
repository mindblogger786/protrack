from django.urls import path
from .views import attendance_records, ExportMyAttendanceCSV
from .views import PunchInView, PunchOutView, AdminExportAttendanceView, AttendanceByUserView, UpdateAttendanceView
from .views import ApplyLeaveView, MyLeaveRequestsView, attendance_requests_view, update_attendance_status


urlpatterns = [
    path('punch-in/', PunchInView.as_view(), name='punch-in'),
    path('punch-out/', PunchOutView.as_view(), name='punch-out'),
    path('records/', attendance_records, name='attendance-records'),
    path('export/', ExportMyAttendanceCSV.as_view(), name='export_my_attendance'),
]

urlpatterns += [
    path('leave/apply-leave/', ApplyLeaveView.as_view(), name='apply-leave'),
    path('leave/my-leaves/', MyLeaveRequestsView.as_view(), name='my-leaves'),
]

urlpatterns += [
    path('admin/attendance-requests/', attendance_requests_view),
    path('admin/attendance-requests/<int:pk>/update/', update_attendance_status),
    path('user/<int:user_id>/', AttendanceByUserView.as_view(), name='attendance-by-user'),
    path('update/<int:attendance_id>/', UpdateAttendanceView.as_view(), name='update-attendance'),
    path('admin/export-attendance/', AdminExportAttendanceView.as_view(), name='admin-export-attendance'),
]
