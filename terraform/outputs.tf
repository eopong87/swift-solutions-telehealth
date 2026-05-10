output "backend_url" {
  value       = "http://${module.alb.alb_dns_name}"
  description = "Backend API URL - use this in your frontend"
}

output "frontend_url" {
  value       = "http://${module.s3.website_url}"
  description = "Frontend website URL"
}

output "db_endpoint" {
  value       = module.rds.db_endpoint
  description = "Database endpoint"
}
