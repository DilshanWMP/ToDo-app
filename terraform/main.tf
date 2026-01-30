terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# --- Data Sources ---
# Get the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# --- Security Group ---
resource "aws_security_group" "web_sg" {
  name        = "todo_app_sg"
  description = "Allow SSH and Web traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- EC2 Instance ---
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  # User Data script to install Docker & Docker Compose
  user_data = <<-EOF
              #!/bin/bash
              # Update and install dependencies
              sudo apt-get update
              sudo apt-get install -y ca-certificates curl gnupg

              # Add Docker's official GPG key
              sudo install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              sudo chmod a+r /etc/apt/keyrings/docker.gpg

              # Add the repository to Apt sources
              echo \
                "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
                sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

              # Install Docker
              sudo apt-get update
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              # Allow ubuntu user to run docker without sudo
              sudo usermod -aG docker ubuntu

              # --- Install Java (Required for Jenkins) ---
              sudo apt-get install -y fontconfig openjdk-17-jre

              # --- Install Jenkins ---
              # --- Install Jenkins ---
              # (Fixing GPG Key Issue - Import the SPECIFIC missing key requested by apt)
              sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7198F4B714ABFC68
              
              # Use standard deb line WITHOUT signed-by restrictions so it sees the key above
              echo "deb https://pkg.jenkins.io/debian-stable binary/" | sudo tee \
                /etc/apt/sources.list.d/jenkins.list > /dev/null
              
              sudo apt-get update
              sudo apt-get install -y jenkins

              # --- Configure Memory Limits (1GB) ---
              # Stop Jenkins to configure it
              sudo systemctl stop jenkins
              
              # Set JAVA_OPTS in /etc/default/jenkins for memory limit
              # Ensure we append or modify the existing JAVA_ARGS
              echo 'JAVA_ARGS="-Djava.awt.headless=true -Xmx1024m -Xms512m"' | sudo tee -a /etc/default/jenkins
              
              # Also set JENKINS_JAVA_OPTIONS for newer systemd setups
              mkdir -p /etc/systemd/system/jenkins.service.d/
              echo '[Service]' | sudo tee /etc/systemd/system/jenkins.service.d/override.conf
              echo 'Environment="JENKINS_JAVA_OPTIONS=-Djava.awt.headless=true -Xmx1024m -Xms512m"' | sudo tee -a /etc/systemd/system/jenkins.service.d/override.conf

              sudo systemctl daemon-reload
              sudo systemctl start jenkins
              
              # Start Jenkins and enable it on boot
              sudo systemctl enable jenkins
              
              # Add jenkins user to docker group
              sudo usermod -aG docker jenkins
              EOF

  tags = {
    Name = "ToDo-App-Server"
  }
}
