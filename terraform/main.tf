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

# ── VPC Network ────────────────────────────────────────────────────────────────
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "mardan-smart-city-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  # No expensive NAT Gateways - keeping it cost-effective
  enable_nat_gateway = false

  tags = {
    Environment = "production"
    Project     = "Mardan-Smart-City"
  }
}

# ── Security Group for K3s ─────────────────────────────────────────────────────
resource "aws_security_group" "k3s_sg" {
  name        = "k3s-cluster-sg"
  description = "Allow HTTP/HTTPS and K3s internal traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all internal communication between K3s nodes
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  # Allow SSH from anywhere (for administration)
  ingress {
    from_port   = 22
    to_port     = 22
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

resource "aws_key_pair" "k3s_key" {
  key_name   = "mardan-k3s-key"
  # Requires the user to have generated an SSH key locally before running terraform apply
  public_key = file("~/.ssh/id_rsa.pub")
}

# ── Basic EC2 Instances for K3s (Zero-Cost Orchestrator) ───────────────────────
resource "aws_instance" "k3s_nodes" {
  count         = 3
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS
  instance_type = "t3.large"              # Cost-effective general purpose compute
  key_name      = aws_key_pair.k3s_key.key_name

  subnet_id                   = module.vpc.public_subnets[count.index % 2]
  vpc_security_group_ids      = [aws_security_group.k3s_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 50
    volume_type = "gp3"
  }

  # Auto-install K3s on boot
  user_data = <<-EOF
              #!/bin/bash
              curl -sfL https://get.k3s.io | sh -
              EOF

  tags = {
    Name        = "mardan-k3s-node-${count.index + 1}"
    Environment = "production"
    Role        = count.index == 0 ? "server" : "agent"
  }
}
