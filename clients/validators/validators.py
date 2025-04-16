class Validator:

    def validate_client_name(self, client_name):
        if client_name.trim() == "":
            return False
        if len(client_name) > 100:
            return False

