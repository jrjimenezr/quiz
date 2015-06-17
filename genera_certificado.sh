mkdir certs
cd certs
openssl genrsa -out quiz-JR-key.pem 2048
openssl req -new -sha256 -key quiz-JR-key.pem -out quiz-JR-csr.pem
openssl x509 -req -in quiz-JR-csr.pem -signkey quiz-JR-key.pem -out quiz-JR-cert.pem

