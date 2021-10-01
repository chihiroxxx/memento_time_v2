# タスク定義
resource "aws_ecs_task_definition" "teddytime_api" {
  family                   = "teddytime_api"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions    = file("./container_definitions_api.json")
  execution_role_arn       = "arn:aws:iam::${var.aws_account_id}:role/ecsTaskExecutionRole"
  task_role_arn            = "arn:aws:iam::${var.aws_account_id}:role/mementotime-RDSFullAccessRole"
}

# サービス作成
resource "aws_ecs_service" "teddytime_api" {
  launch_type                        = "FARGATE"
  task_definition                    = aws_ecs_task_definition.teddytime_api.arn
  platform_version                   = "LATEST"
  cluster                            = aws_ecs_cluster.teddytime_cluster.arn
  name                               = "teddytime_api"
  scheduling_strategy                = "REPLICA"
  desired_count                      = 1
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 10000
  network_configuration {
    assign_public_ip = false
    security_groups = [
      module.teddytime_api_sg.security_group_id
    ]
    subnets = [
      aws_subnet.private1.id
    ]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.teddytime_api_tg.arn
    container_name   = "memento_rails_only"
    container_port   = 3000
  }
}

module "teddytime_api_sg" {
  source      = "./security_group"
  name        = "teddytime-api-sg"
  vpc_id      = aws_vpc.memento_vpc.id
  port        = 3000
  cidr_blocks = [aws_vpc.memento_vpc.cidr_block]
}




resource "aws_cloudwatch_log_group" "for_ecs_api" {
  name              = "/ecs/teddytime-api"
  retention_in_days = 180
}
resource "aws_ecs_task_definition" "teddytime_api_initialize" {
  family                   = "teddytime_api_initialize"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions    = file("./container_definitions_api_initialize.json")
  execution_role_arn       = "arn:aws:iam::${var.aws_account_id}:role/ecsTaskExecutionRole"
  task_role_arn            = "arn:aws:iam::${var.aws_account_id}:role/mementotime-RDSFullAccessRole"
}
