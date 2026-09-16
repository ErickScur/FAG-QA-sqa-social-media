# SQA Social Media

Projeto educacional com uma API Spring Boot e um frontend Next.js.

## Visão Geral

- `api/`: backend Java 17 com Spring Boot, autenticação, usuários, posts e curtidas.
- `client/`: frontend Next.js/React que consome a API.

Principais rotas da aplicação:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8080`

## Como Rodar com Docker

Essa é a forma recomendada, porque não exige Java, Node ou MySQL instalados na máquina. O único pré-requisito é o Docker com o plugin Compose.

Na raiz do repositório:

```bash
docker compose up --build
```

Os três serviços sobem juntos:

| Serviço  | Descrição                     | Porta |
| -------- | ----------------------------- | ----- |
| `db`     | MySQL 8 com o banco já criado | 3307  |
| `api`    | API Spring Boot               | 8080  |
| `client` | Frontend Next.js              | 3000  |

A API só inicia depois que o healthcheck do MySQL passa, então não é preciso subir nada em ordem manual. As tabelas são criadas pelo Hibernate no primeiro start (`ddl-auto=update`).

O MySQL do container é publicado em `3307` na máquina, e não em `3306`, para não conflitar com um MySQL já instalado localmente. Dentro da rede do Compose a API continua acessando `db:3306`.

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

Para parar:

```bash
docker compose down
```

Para parar e apagar também os dados do banco:

```bash
docker compose down -v
```

### Variáveis de ambiente

A API lê a conexão do banco de variáveis de ambiente, com valores padrão para execução local:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

O frontend usa `NEXT_PUBLIC_BASE_URL` para saber onde está a API. Como a variável é lida em tempo de build do Next, ela é passada como build arg no `docker-compose.yml`.

## Como Rodar Localmente

Pré-requisitos:

- Java 17+
- Node.js 18+
- npm
- MySQL configurado para o ambiente de desenvolvimento

API:

```bash
cd api
./mvnw spring-boot:run
```

Frontend:

```bash
cd client
npm install
npm run dev
```

O frontend usa `NEXT_PUBLIC_BASE_URL` para definir a URL da API. Exemplo de `.env` em `client/`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

## Testes

API:

```bash
cd api
./mvnw test
```

Frontend:

```bash
cd client
npm test
```

Se não houver Java ou Node instalados, os testes também rodam dentro de containers descartáveis, a partir da raiz do repositório:

```bash
docker run --rm -v "$PWD/api":/app -w /app maven:3.9.9-eclipse-temurin-17 mvn test
docker run --rm -v "$PWD/client":/app -w /app node:24-alpine sh -c "npm ci && npm test"
```

## Documentações

- [README da API](api/README.md)
- [README do Frontend](client/README.md)
- [DummyJSON API Docs](https://dummyjson.com/docs)
