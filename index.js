/*
GET - Buscar informações no back-end
POST - Criar informação no back-end
PUT / PATCH  - Alterar/Atualizar informação no back-end
DELETE - Deletar informação no back-end

Middleware - INTERCEPTADOR - Tem o podeer de parar ou alterar dados da requisição

*/

const express = require('express')
const uuid = require('uuid') // biblioteca uuid para criar números de id universais que não se repetem
const port = 4000

const app = express()
app.use(express.json()) // quer dizer que toda a aplicação tá usando json

const users = []

const checkUserId = (request, response, next) => { // middleware é uma função, a diferença dele para as outras rotas é pq ele tem o next()
        const { id } = request.params

        const index = users.findIndex(user => user.id === id)

        if (index < 0) {
            return response.status(404).json({ message: "User not found!" })
        }

        request.userIndex = index
        request.userId = id
            //nesse exemplo ele vai verificar os id. Isso seria feito dentro de duas rotas (put e delete)
        next()
    }
    /*
    const myFirstMiddleware = (request, response, next) => { // 
        console.log('Fui chamado!')

        next() // aqui ele vai seguir o fluxo abaixo normal da aplicação. Quando acabar ele volta pro next pra executar o que tiver nele 
    }

    app.use(myFirstMiddleware) // o middleware só vai ser aplicado pras rotas que vierem abaixo dele
    */

// O QUE ESTIVER COMENTADO DENTRO DAS ROTAS FOI DEPOIS DE INSERIR O MIDDLEWARE - POIS FORAM COLOCADOS DENTRO DELE
app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body


    const user = { id: uuid.v4(), name, age }
    users.push(user)

    return response.status(201).json(user)
})

app.put('/users/:id'), checkUserId, (request, response) => { // essa parte não rodou no insominia como deveria
    //const { id } = request.params                       // a informação do midlleware foi adicionada (checkUserId), pq vai ser tipo, ates de chamar essa rota dá uma passadinha lá no midlleware e depois vc volta
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age } // guarda as informações atualizadas do usuário

    //const index = users.findIndex(user => user.id === id)

    /*if (index < 0) {
        return response.status(404).json({ message: "User not found!" })
    }*/

    users[index] = updateUser

    return response.json(updateUser)

}

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex
        //  const { id } = request.params


    // const index = users.findIndex(user => user.id === id)

    /*if (index < 0) {
        return response.status(404).json({ message: "User not found!" })
    }*/

    users.splice(index, 1)

    return response.status(204).json()
})



//find - encontra a informação dentro do array e assim que encontrar, me retorna
//findIndex - me retorna o local do array que ta minha informação. Caso nao seja encontrada a informação, ela vai retornar com -1

app.listen(port, () => {
    console.log(`🤩 Server started on port ${port}`)
})