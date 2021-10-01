FROM golang:latest

WORKDIR /go/src/backend



COPY . .
RUN go mod download

# RUN go build -o from-docker main.go // 本番環境
CMD [ "go run main.go" ]

# CMD [ "./from-docker" ] // 本番環境
