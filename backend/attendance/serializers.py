from rest_framework import serializers
from .models import Attendance, LeaveRequest
from datetime import datetime

class AttendanceSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = Attendance
        fields = ['id', 'user', 'user_name', 'date', 'punch_in', 'punch_in_status', 'punch_out', 'punch_in_photo', 'punch_out_photo', 'location']
        read_only_fields = ['user', 'user_name', 'date']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class LeaveRequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ['user', 'status', 'applied_at']

    def validate_start_date(self, value):
        if isinstance(value, datetime):
            return value.date()
        return value

    def validate_end_date(self, value):
        if isinstance(value, datetime):
            return value.date()
        return value
