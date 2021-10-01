resource "aws_ssm_parameter" "rails_production_key" {
  name = "/memento/api/rails-production-key"
  value       = "pleaseChangeOnCLI" # CLIにて変更
  type        = "SecureString"
  description = "rails production 起動用の環境変数"
  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
