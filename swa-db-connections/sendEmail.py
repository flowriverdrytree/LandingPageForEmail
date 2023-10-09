
#!/usr/bin/env python
import os, argparse
from azure.cosmos import CosmosClient
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def main(args):
    # Setup cosmosDB container stack for query
    connection_string = os.environ.get("DATABASE_CONNECTION_STRING")
    if connection_string is None:
        print("Invalid Connection String")
        return

    client = CosmosClient.from_connection_string(connection_string)
    database_id = "MyTestPersonDatabase"
    container_id = "MyTestPersonContainer"

    database = client.get_database_client(database_id)
    container = database.get_container_client(container_id)

    # Query all emails from the container
    query_result = list(container.query_items(
        query="SELECT * FROM c",
        enable_cross_partition_query=True  # Set this to True if items are distributed across multiple partitions
    ))

    emailList = []
    for item in query_result:
        emailList.append(item['id'])

    # Send Marketing Emails!
    send_greeting_email(emailList)


def send_greeting_email(email_list):
    # Gmail SMTP configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = os.environ.get("FLOWRIVER_EMAIL")
    smtp_app_password = os.environ.get("FLOWRIVER_EMAIL_APP_SALT")

    # Create an SMTP connection
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_app_password)

    # Email content
    subject = 'Greetings from My Python Script'
    message = 'Hello, this is a test greeting email from my Python script!'

    for email in email_list:
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = email
        msg['Subject'] = subject

        # Attach the message to the email
        msg.attach(MIMEText(message, 'plain'))

        # Send the email
        server.sendmail(smtp_username, email, msg.as_string())
        print(f"Send email to -> {email}")

    # Close the SMTP connection
    server.quit()

# Standard boilerplate to call the main() function to begin the program.
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    # parser.add_argument(dest='root', help="root of the images directory")
    args = parser.parse_args()
  
    main(args)