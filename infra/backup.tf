resource "aws_db_snapshot" "postgres_daily" {
  db_instance_identifier = aws_db_instance.postgres.id
  db_snapshot_identifier = "openai-saas-postgres-daily-${formatdate("YYYYMMDD", timestamp())}"
}

resource "aws_cloudwatch_metric_alarm" "rds_unhealthy" {
  alarm_name          = "openai-saas-rds-unhealthy"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "RDS unhealthy or unreachable!"
  actions_enabled     = true
  alarm_actions       = [var.pagerduty_sns_arn]
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
}
