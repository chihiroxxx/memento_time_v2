resource "aws_db_parameter_group" "mysql_teddy_config" {
  name   = "mysql-teddy-config"
  family = "mysql5.7"
  parameter {

    name  = "character_set_database"
    value = "utf8"
  }
  parameter {

    name  = "character_set_server"
    value = "utf8"
  }

}


resource "aws_db_subnet_group" "mysql_teddy_subnet" {
  name = "mysql-teddy-subnet"
  subnet_ids = [
    aws_subnet.database_subnet1.id,
    aws_subnet.database_subnet2.id,
  ]
}


resource "aws_db_instance" "mysql_teddy_database" {
  identifier                 = "mysql-teddy-database"
  engine                     = "mysql"
  engine_version             = "5.7.25"
  instance_class             = "db.t2.micro"
  allocated_storage          = 20
  storage_type               = "gp2"
  username                   = "root"
  password                   = "changepassword"
  multi_az                   = false
  publicly_accessible        = false
  auto_minor_version_upgrade = false
  deletion_protection        = false
  port                       = 3306
  apply_immediately          = true
  skip_final_snapshot        = true
  vpc_security_group_ids = [
    module.mysql_sg.security_group_id
  ]
  parameter_group_name = aws_db_parameter_group.mysql_teddy_config.name
  db_subnet_group_name = aws_db_subnet_group.mysql_teddy_subnet.name
  lifecycle {
    ignore_changes = [
      password
    ]
  }
}

output "mysql_teddy_database_endpoint" {
  value = aws_db_instance.mysql_teddy_database.endpoint
}

module "mysql_sg" {
  source      = "./security_group"
  name        = "terraform-myapl-teddy-sg"
  vpc_id      = aws_vpc.memento_vpc.id
  port        = 3306
  cidr_blocks = [aws_vpc.memento_vpc.cidr_block]
}
