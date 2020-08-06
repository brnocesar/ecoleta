# API (_back-end_)

O _back-end_ da aplicação é uma API que serve as aplicações _web_ e _mobile_. Suas funcionalidades são:

- Listar items coletados  
- Cadastrar um ponto de coleta  
- Listar pontos de coleta, com filtros  
- Apresentar um ponto de coleta

## Pós-clone

Instalar dependências:

```terminal
npm install
```

Rodar as _migrations_ e os _seeders_: 

```terminal
npm run migrate
npm run seed
```

Levantar o servidor de desenvolvimento:

```terminal
npm run dev
```

## Comando úteis para desenvolvimento

- Criar uma _migration_:

```terminal
npx knex migrate:make `migration_name` -x ts
```
