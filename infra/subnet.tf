# VPC作成

resource "aws_vpc" "memento_vpc" {
  cidr_block           = "100.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "memento_vpc"
  }
}


# インターネットゲートウェイ

resource "aws_internet_gateway" "memento_igw" {
  vpc_id = aws_vpc.memento_vpc.id
}

# ルートテーブル
resource "aws_route_table" "memento_vpc" {
  vpc_id = aws_vpc.memento_vpc.id
}

# パブリックサブネット作成

resource "aws_subnet" "public1" {
  vpc_id     = aws_vpc.memento_vpc.id
  cidr_block = "100.0.30.0/24"
  availability_zone = "ap-northeast-1a"
  tags = {
    "Name" = "public1"
  }
}
resource "aws_subnet" "public2" {
  vpc_id     = aws_vpc.memento_vpc.id
  cidr_block = "100.0.31.0/24"
  availability_zone = "ap-northeast-1c"
  tags = {
    "Name" = "public2"
  }
}

# ルートテーブル！
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.memento_vpc.id
  tags = {
    "Name" = "public_route_table"
  }
}
resource "aws_route" "public_route" {
  route_table_id         = aws_route_table.public_route_table.id
  gateway_id             = aws_internet_gateway.memento_igw.id
  destination_cidr_block = "0.0.0.0/0"

}
# 関連付け！
resource "aws_route_table_association" "public1" {
  subnet_id      = aws_subnet.public1.id
  route_table_id = aws_route_table.public_route_table.id
}
resource "aws_route_table_association" "public2" {
  subnet_id      = aws_subnet.public2.id
  route_table_id = aws_route_table.public_route_table.id
}


# プライベートサブネット
resource "aws_subnet" "private1" {
  vpc_id     = aws_vpc.memento_vpc.id
  cidr_block = "100.0.32.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "ap-northeast-1a"
  tags = {
    "Name" = "private1"
  }
}
resource "aws_subnet" "private2" {
  vpc_id     = aws_vpc.memento_vpc.id
  cidr_block = "100.0.33.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "ap-northeast-1c"
  tags = {
    "Name" = "private2"
  }
}

# プライベートルートテーブル

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.memento_vpc.id
  tags = {
    "Name" = "private_route_table"
  }
}

# プライベートのアソシエーション
resource "aws_route_table_association" "private1" {
  subnet_id      = aws_subnet.private1.id
  route_table_id = aws_route_table.private_route_table.id
}
resource "aws_route_table_association" "private2" {
  subnet_id      = aws_subnet.private2.id
  route_table_id = aws_route_table.private_route_table.id
}

variable "aws_region" {
  default = "ap-northeast-1"
}
variable "aws_profile" {
  default = "terraform-user"
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}




# NATゲートウェイなどの設定

# EIP
resource "aws_eip" "nat_gateway" {
  vpc = true
  depends_on = [
    aws_internet_gateway.memento_igw
  ]
}
# NAT_GW
resource "aws_nat_gateway" "private" {
  allocation_id = aws_eip.nat_gateway.id
  subnet_id     = aws_subnet.public1.id
  depends_on = [
    aws_internet_gateway.memento_igw
  ]
}

resource "aws_route" "private" {
  route_table_id         = aws_route_table.private_route_table.id
  nat_gateway_id         = aws_nat_gateway.private.id
  destination_cidr_block = "0.0.0.0/0"
}


# DB用サブネット！
# よりセキュアに3層構造

resource "aws_subnet" "database_subnet1" {
  vpc_id     = aws_vpc.memento_vpc.id
  cidr_block = "100.0.34.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "ap-northeast-1a"
  tags = {
    "Name" = "database_subnet1"
  }
}

resource "aws_subnet" "database_subnet2" {
  vpc_id     = aws_vpc.memento_vpc.id
  cidr_block = "100.0.35.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "ap-northeast-1c"
  tags = {
    "Name" = "database_subnet2"
  }
}


resource "aws_route_table" "database_route_table" {
  vpc_id = aws_vpc.memento_vpc.id
  tags = {
    "Name" = "database_route_table"
  }
}
