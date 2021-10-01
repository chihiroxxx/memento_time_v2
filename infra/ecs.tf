variable "aws_account_id" {}

# クラスター作成
resource "aws_ecs_cluster" "teddytime_cluster" {
  name = "teddytime"
}
# タスク定義
resource "aws_ecs_task_definition" "teddytime_web" {
  family                   = "teddytime_web"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions    = file("./container_definitions_web.json")
  execution_role_arn       = "arn:aws:iam::${var.aws_account_id}:role/ecsTaskExecutionRole"
}

# サービス作成
resource "aws_ecs_service" "teddytime_web" {
  name                              = "teddytime_web"
  cluster                           = aws_ecs_cluster.teddytime_cluster.arn
  task_definition                   = aws_ecs_task_definition.teddytime_web.arn
  desired_count                     = 1
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 60
  network_configuration {
    assign_public_ip = false
    security_groups = [
      module.teddytime_web_sg.security_group_id
    ]
    subnets = [
      aws_subnet.private1.id
    ]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.teddytime_web_tg.arn
    container_name   = "memento_nginx"
    container_port   = 80
  }
  lifecycle {
    ignore_changes = [
      task_definition
    ]
  }
}

module "teddytime_web_sg" {
  source      = "./security_group"
  name        = "teddytime-web-sg"
  vpc_id      = aws_vpc.memento_vpc.id
  port        = 80
  cidr_blocks = [aws_vpc.memento_vpc.cidr_block]
}

resource "aws_cloudwatch_log_group" "for_ecs" {
  name              = "/ecs/teddytime-web"
  retention_in_days = 180
}


