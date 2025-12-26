resource "aws_ce_cost_category" "openai_saas" {
  name = "OpenAISaaS"
  rule_version = "CostCategoryExpression.v1"
  rules = [
    {
      value = "Backend"
      rule = {
        dimensions = {
          Key = "SERVICE"
          Values = ["Amazon ECS", "Amazon RDS", "Amazon ElastiCache"]
        }
      }
    }
  ]
}

# Usage analytics and cost explorer are managed in AWS Console
