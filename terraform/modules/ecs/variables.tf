variable "app_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_1_id" {
  type = string
}

variable "public_subnet_2_id" {
  type = string
}

variable "aws_account_id" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "db_endpoint" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "target_group_arn" {
  type = string
}

variable "alb_security_group_id" {
  type = string
}

variable "alb_listener_arn" {
  type = string
}
