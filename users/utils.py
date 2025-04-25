def create_user_log(current_user, type_of_log, log_message):
    from users.models import UserLogs
    UserLogs.objects.create(
        user = current_user,
        log_type = type_of_log,
        message = log_message
    )