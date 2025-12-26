resource "aws_elasticache_subnet_group" "main" {
  name       = "openai-saas-redis"
  subnet_ids = var.redis_subnet_ids
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "openai-saas-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

resource "aws_security_group" "redis" {
  name        = "openai-saas-redis"
  description = "Allow backend to access Redis"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.backend_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "redis_subnet_ids" {
  description = "Subnet IDs for Redis."
  type        = list(string)
}
