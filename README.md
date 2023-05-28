# Projeto para estudar react-hook-form, zod e validações

## Etapas do projeto

- [X] Criar uma estrutura básica de fromulários com react-hook-form
- [X] Criar a possibilidade de validação/trasnformação;
- [ ] Lidar com upload de arquivos;
- [ ] Composition Pattern



## Setup do projeto

```
- npm install react-hook-form zod @hookform/resolvers
- npm i -D tailwindcss postcss typescript @types/react autoprefixer 
```


Após isso, configuração do TailwindCSS

## Configurando o tailwindcss


- No arquivo tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```js

-No arquvo global de css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```


### Configurações do Eslint

Para instalação do Eslint, irá ser feito uso do padrão da RocketSeat, para isso deve ser feita a instalação do pacote com dependência de Dev: 
``` npm i eslint @rocketseat/eslint-config -D ```.
 
 - .eslintrc.json
 
 ```js
 
 {
  "extends":[
    "@rocketseat/eslint-config/react"
  ],
  "rules": {
    "camelcase": "off",
    "no-useless-constructor": "off"
  }
}
 
 ```
 - .eslintignore
 
 ```
node_modules
build
 ```

 ## Criando formulários simples com react-hook-form
 
 ### Construção da estrtura simples de formulário com Tailwindcss
 
 ```js
 <main
        className={`h-screen ${
          darkMode ? 'bg-zinc-900 text-zinc-300' : 'bg-zync-50'
        } flex flex-col items-center justify-center`}
      >
        <form
          onSubmit={handleSubmit(createUser)}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="">E-mail</label>
            <input
              {...register('email')}
              type="email"
              className="border border-gray-400  shadow-sm rounded h-10 px-3"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="border border-gray-400 shadow-sm rounded h-10 px-3"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          >
            Salvar
          </button>
 
 ```
 
 ### Utilizando o react hook form 
 Dentro de cada input, passar a propriedade de {...register('nomeObjeto')}, com o nome do objeto a ser criado.
 
 ```js
 const [output, setOutput] = useState('')
 const { register, handleSubmit } = useForm()
 
 function createUser(data: any) {
    setOutput(JSON.stringify(data))
  }
 
 
 ```js
 
### Validação e transformação, fazendo uso da biblioteca zod e do pacote @hookform/resolvers/zod
 
 - Criando Schema de validação dos campos com zod e obtendo tipagem estática de acordo com schema
 
 
 ```js
 const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((palavra) => {
          return palavra[0].toLocaleUpperCase().concat(palavra.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string().min(6, 'Senha precisa de no mínimo 6 caracteres'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>
 
 ```

 - Obtendo errors validator a partir do resolver
  
  
  ```js
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })
  
  
  {errors.name && <span>{errors.name.message}</span>}
  ```
 
 - Criando validação com transform, refine e nativeValidations

```js
const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((palavra) => {
          return palavra[0].toLocaleUpperCase().concat(palavra.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .refine((email) => {
      return email.endsWith('@gmail.com')
    }, 'O e-mail deve ser do domínio @gmail.com'),
  password: z.string().min(6, 'Senha precisa de no mínimo 6 caracteres'),
})
```
#### Utilizando FieldArray
Estrturas de fieldArrays, são muito utilizadas quando se há necessidade de inclusão de campos de forma gradativa, nesse viés pode se fazer uso da estrutura a seguir: 

```js

import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((palavra) => {
          return palavra[0].toLocaleUpperCase().concat(palavra.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .refine((email) => {
      return email.endsWith('@gmail.com')
    }, 'O e-mail deve ser do domínio @gmail.com'),
  password: z.string().min(6, 'Senha precisa de no mínimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O titulo é obrigatório'),
        knowledge: z.coerce.number().min(1).max(100),
      }),
    )
    .min(2, 'Insira pelo menos 2 tecnologias'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>


  const { fields, append } = useFieldArray({
    name: 'techs',
    control,
  })
  function addNewTech() {
    append({
      title: '',
      knowledge: 0,
    })
  }
  
  
  
  <div className="flex flex-col gap-1">
            <label htmlFor="" className="flex items-center justify-between">
              Tecnologias
              <button
                onClick={addNewTech}
                className="text-emerald-500 text-sm"
                type="button"
              >
                Adicionar
              </button>
            </label>
            {fields.map((field, i) => {
              return (
                <div key={field.id} className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      key={i}
                      type="text"
                      {...register(`techs.${i}.title`)}
                      className=" border border-gray-400 shadow-sm rounded h-10 px-3"
                    />
                    {errors.techs?.[i]?.title && (
                      <span className="text-red-500 text-sm">
                        {errors.techs?.[i]?.title?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      key={i}
                      type="number"
                      {...register(`techs.${i}.knowledge`)}
                      className="w-16 border border-gray-400 shadow-sm rounded h-10 px-3"
                    />
                    {errors.techs?.[i]?.knowledge && (
                      <span className="text-red-500 text-sm">
                        {errors.techs?.[i]?.knowledge?.message}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {errors.techs && (
              <span className="text-red-500 text-sm">
                {errors.techs.message}
              </span>
            )}
          </div>


```
 
## 
