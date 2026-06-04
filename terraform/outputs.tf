output "k3s_server_ip" {
  description = "Public IP of the K3s Server Node (Control Plane)"
  value       = aws_instance.k3s_nodes[0].public_ip
}

output "k3s_agent_ips" {
  description = "Public IPs of the K3s Agent Nodes"
  value       = slice(aws_instance.k3s_nodes[*].public_ip, 1, length(aws_instance.k3s_nodes))
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the K3s nodes"
  value       = aws_security_group.k3s_sg.id
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}
