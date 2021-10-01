resource "aws_ssm_parameter" "database_username" {
  name        = "/db/username"
  value       = "root"
  type        = "String"
  description = "データベースユーザー名(mementotime-database用)"
}


resource "aws_ssm_parameter" "database_password" {
  name = "/db/password"
  value       = "uninitialized" # ここの値をCLIで上書きすること！！
  type        = "SecureString"
  description = "データベースパスワードCLIで変更すること！(mementotime-database用)"
  lifecycle {
    ignore_changes = [
      value
    ]
  }
}


resource "aws_ssm_parameter" "database_hostname" {
  name = "/db/hostname"
  value = aws_db_instance.mysql_teddy_database.address
  type        = "String"
  description = "データベースホスト名"
}
output "database_hostname" {
  value = aws_db_instance.mysql_teddy_database.address
}
