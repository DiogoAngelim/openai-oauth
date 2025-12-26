resource "aws_cloudwatch_metric_alarm" "backend_uptime" {
  alarm_name          = "openai-saas-backend-uptime"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "Backend service is down!"
  actions_enabled     = true
  alarm_actions       = [var.pagerduty_sns_arn]
  dimensions = {
    LoadBalancer = var.backend_lb_arn_suffix
  }
}

variable "pagerduty_sns_arn" {
  description = "SNS topic for PagerDuty/Opsgenie alerts."
  type        = string
}

variable "backend_lb_arn_suffix" {
  description = "ARN suffix for backend load balancer."
  type        = string
}
