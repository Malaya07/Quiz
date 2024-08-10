
resource "aws_instance" "Application" {
  ami           = "ami-062cf18d655c0b1e8"
  instance_type = "t2.micro"
  key_name = "mk3"
  tags = {
    Name = "master"
  }
  provisioner "file" {
    source      = "./front.sh"
    destination = "/home/ubuntu/front.sh"
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("./mk3.pem")}"
      host        = "${self.public_dns}"
    }
  }
provisioner "remote-exec" {
   connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("./mk3.pem")}"
      host        = "${self.public_dns}"
    }
    inline = [
      "chmod +x /home/ubuntu/front.sh",
      "./front.sh",
    ]
  }  

  }

  