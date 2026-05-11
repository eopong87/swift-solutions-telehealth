# VPC Module - creates our private network
module "vpc" {
  source     = "./modules/vpc"
  app_name   = var.app_name
  aws_region = var.aws_region
}

# RDS Module - creates our PostgreSQL database
module "rds" {
  source              = "./modules/rds"
  app_name            = var.app_name
  vpc_id              = module.vpc.vpc_id
  private_subnet_1_id = module.vpc.private_subnet_1_id
  private_subnet_2_id = module.vpc.private_subnet_2_id
  db_name             = var.db_name
  db_username         = var.db_username
  db_password         = var.db_password
}

# ALB Module - creates our load balancer
module "alb" {
  source             = "./modules/alb"
  app_name           = var.app_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_1_id = module.vpc.public_subnet_1_id
  public_subnet_2_id = module.vpc.public_subnet_2_id
}

# ECS Module - runs our backend container
module "ecs" {
  source                = "./modules/ecs"
  app_name              = var.app_name
  vpc_id                = module.vpc.vpc_id
  public_subnet_1_id    = module.vpc.public_subnet_1_id
  public_subnet_2_id    = module.vpc.public_subnet_2_id
  aws_account_id        = var.aws_account_id
  aws_region            = var.aws_region
  db_endpoint           = module.rds.db_endpoint
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  target_group_arn      = module.alb.target_group_arn
  alb_security_group_id = module.alb.alb_security_group_id
  alb_listener_arn      = module.alb.alb_listener_arn
  anthropic_api_key     = var.anthropic_api_key
}

# S3 Module - hosts our React frontend
module "s3" {
  source   = "./modules/s3"
  app_name = var.app_name
}
