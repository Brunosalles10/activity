# 📚 Projeto Acadêmico – Gerenciador de Trilhas de Aprendizado - OrganizaE

---

## 🚀 Sobre o Projeto

Este é um aplicativo mobile desenvolvido em React Native para gerenciamento de atividades/trilhas acadêmicas.
Com ele, o aluno pode cadastrar, visualizar, pesquisar, editar e excluir trilhas de estudo, facilitando o acompanhamento de prazos e conteúdos.
Este projeto é uma API construída com NestJS, utilizando TypeORM, PostgreSQL, JWT, Guards de autorização, Redis para cache, Pub/Sub para eventos e um sistema robusto de validação e consistência de dados.

Ele foi projetado seguindo boas práticas de arquitetura, segurança e escalabilidade.

---

## 🛠️ Tecnologias Utilizadas

- **React Native (Expo)**
- **NestJS — Framework Node.js modular**
- **TypeORM — ORM para banco de dados relacional**
- **PostgreSQL — Banco de dados principal**
- **JWT + Passport — Autenticação**
- **BCrypt — Hash de senhas**
- **Redis**
- **CacheService — Cache de usuários e atividades**
- **PubSubService — Eventos distribuídos**
- **Class-Validator / Class-Transformer**
- **Guards e Decorators personalizados**
- **Multer para o envio de imagens**

---

## 📱 Funcionalidades

- ➕ **Adicionar trilha** com título, matéria, professor, data de entrega, status e link
- 📋 **Listar todas as trilhas** em cards organizados
- 🔍 **Pesquisar trilhas** por nome
- 📝 **Editar trilha existente**
- ❌ **Excluir trilha** (com confirmação via Toast)
- 📅 **Máscara automática para datas** no formato `dd/mm/yyyy`
- 🔔 **Mensagens toast personalizadas** (sucesso, erro, info)
- ✅ **Ícones correspondentes ao status** da trilha:
  - 🔴 **Pendente**
  - 🔵 **Em andamento**
  - 🟢 **Concluído**

---

## 🎨 Layout

- Interface **simples e intuitiva**
- Trilhas exibidas em **cards com ícones representativos**
- Ícones de status visíveis no cabeçalho de cada card
- Envio de imagens com multer

---
