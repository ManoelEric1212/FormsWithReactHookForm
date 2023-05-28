import './styles/global.css'
import './style.css'
import { useForm } from 'react-hook-form'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

export default function App() {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const [output, setOutput] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const handleToogleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked)
  }
  function createUser(data: any) {
    setOutput(JSON.stringify(data))
  }
  return (
    <>
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
            <label htmlFor="">Nome</label>
            <input
              {...register('name')}
              type="text"
              className="border border-gray-400  shadow-sm rounded h-10 px-3"
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">E-mail</label>
            <input
              {...register('email')}
              type="email"
              className="border border-gray-400  shadow-sm rounded h-10 px-3"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="border border-gray-400 shadow-sm rounded h-10 px-3"
            />
          </div>
          {errors.password && <span>{errors.password?.message}</span>}

          <button
            type="submit"
            className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          >
            Salvar
          </button>
          <div className="flex w-full justify-end">
            <label
              htmlFor="toogleA"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input
                  id="toogleA"
                  type="checkbox"
                  className="sr-only"
                  checked={darkMode}
                  onChange={handleToogleChange}
                />
                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
                <div className="dot absolute w-6 h-6 bg-gray-800 rounded-full shadow -left-1 -top-1 transition" />
              </div>
              <div className="ml-3 text-gray-700 font-medium">Modo escuro</div>
            </label>
          </div>
        </form>
        <pre>{output}</pre>
      </main>
    </>
  )
}
