variable "acm_id" {}
variable "zone_id" {}
variable "domain_name" {}


# まずhttp用ALB
resource "aws_lb" "teddytime_web_lb" {
  name                       = "teddytime-web-lb"
  load_balancer_type         = "application"
  internal                   = false
  idle_timeout               = 60
  enable_deletion_protection = false
  subnets = [
    aws_subnet.public1.id,
    aws_subnet.public2.id,
  ]
  security_groups = [
    module.http_sg.security_group_id,
    module.https_sg.security_group_id,
  ]
}
output "alb_dns_name" {
  value = aws_lb.teddytime_web_lb.dns_name
}


# セキュリティグループ
module "http_sg" {
  source      = "./security_group"
  name        = "http-sg"
  vpc_id      = aws_vpc.memento_vpc.id
  port        = 80
  cidr_blocks = ["0.0.0.0/0"]
}
module "https_sg" {
  source      = "./security_group"
  name        = "https-sg"
  vpc_id      = aws_vpc.memento_vpc.id
  port        = 443
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.teddytime_web_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}


resource "aws_route53_record" "teddytime" {
  zone_id = var.zone_id
  name    = var.domain_name
  type    = "A"
  alias {
    name                   = aws_lb.teddytime_web_lb.dns_name
    zone_id                = aws_lb.teddytime_web_lb.zone_id
    evaluate_target_health = false
  }
}

# https用ロードバランサー

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.teddytime_web_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = var.acm_id
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "ピョーHTTPSです！！！！！"
      status_code  = "200"
    }
  }
}

resource "aws_lb_target_group" "teddytime_web_tg" {
  name                 = "teddytime-web-tg"
  target_type          = "ip"
  vpc_id               = aws_vpc.memento_vpc.id
  port                 = 80
  protocol             = "HTTP"
  deregistration_delay = 300
  health_check {
    path                = "/"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = 200
    port                = "traffic-port"
    protocol            = "HTTP"
  }
  depends_on = [
    aws_lb.teddytime_web_lb
  ]
}

resource "aws_lb_listener_rule" "teddytime_web_tg_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 200
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.teddytime_web_tg.arn
  }
  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
resource "aws_lb_listener_rule" "teddytime_web_tg_rule_api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.teddytime_api_tg.arn
  }
  condition {
    path_pattern {
      values = ["/api/v1/*"]
    }
  }
}


# apiのターゲットグループ！
resource "aws_lb_target_group" "teddytime_api_tg" {
  name                 = "teddytime-api-tg"
  target_type          = "ip"
  vpc_id               = aws_vpc.memento_vpc.id
  port                 = 80
  protocol             = "HTTP"
  deregistration_delay = 300
  health_check {
    path                = "/"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = 401
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  depends_on = [
    aws_lb.teddytime_web_lb
  ]
}
