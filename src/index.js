const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://lange-page-portfolio.netlify.app'], // Substitua com a URL onde sua aplicação React está hospedada
  methods: ['GET'], // Métodos permitidos (GET, POST, etc.)
  allowedHeaders: ['Content-Type'], // Headers permitidos na requisição
}));

// Configuração do multer para armazenamento dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send(`<p style="color: red;">Deu certo!</p>`);
});

// Rota para visualizar o PDF
app.get('/preview', (req, res) => {
  // Caminho para o arquivo PDF
  const filePath = path.join(__dirname, '../uploads', '1720743013952-curriculo_atualizado.pdf');

  // fs.readdir(uploadDir, (err, files) => {
  //   if (err) {
  //     return res.status(500).send('Não foi possível listar os arquivos.');
  //   }
  //   res.json(files);
  // })

  // Verifica se o arquivo existe
  fs.stat(filePath, (err, stat) => {
    if (err) {
      console.error('Arquivo não encontrado', err);
      return res.status(404).send('Arquivo não encontrado');
    }

    // Define o cabeçalho de resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=curriculo_atualizado.pdf'); 
    //attachment pdf baixado
    //inline abre o pdf no navegador
    res.setHeader('Content-Length', stat.size);

  //   // Cria uma stream para ler o arquivo e enviar a resposta
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

// Rota para baixar o PDF
app.get('/download', (req, res) => {
  // Caminho para o arquivo PDF
  const filePath = path.join(__dirname, '../uploads', '1720743013952-curriculo_atualizado.pdf');

  // fs.readdir(uploadDir, (err, files) => {
  //   if (err) {
  //     return res.status(500).send('Não foi possível listar os arquivos.');
  //   }
  //   res.json(files);
  // })

  // Verifica se o arquivo existe
  fs.stat(filePath, (err, stat) => {
    if (err) {
      console.error('Arquivo não encontrado', err);
      return res.status(404).send('Arquivo não encontrado');
    }

    // Define o cabeçalho de resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=curriculo_atualizado.pdf'); 
    //attachment pdf baixado
    //inline abre o pdf no navegador
    res.setHeader('Content-Length', stat.size);

  //   // Cria uma stream para ler o arquivo e enviar a resposta
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});


// Rota para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file)
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  res.send(`Arquivo ${req.file.originalname} enviado com sucesso!`);
});

// Cria o diretório de uploads se não existir
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
