import './styles/global.css'
import './style.css'
import { useForm, useFieldArray } from 'react-hook-form'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file!.size <= 2 * 1024 * 1024,
      'O arquivo deve ser menor que 5MB',
    ),
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

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

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

  const [output, setOutput] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const handleToogleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked)
  }
  async function createUser(data: CreateUserFormData) {
    await supabase.storage
      .from('formsReact')
      .upload(data.avatar?.name, data.avatar)
    console.log(data.avatar)
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
            <label htmlFor="avatar">Avatar</label>
            <input {...register('avatar')} type="file" accept="image/*" />
            {errors.avatar && (
              <span className="text-red-500 text-sm">
                {errors.avatar.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Nome</label>
            <input
              {...register('name')}
              type="text"
              className="border border-gray-400  shadow-sm rounded h-10 px-3"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">E-mail</label>
            <input
              {...register('email')}
              type="email"
              className="border border-gray-400  shadow-sm rounded h-10 px-3"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="border border-gray-400 shadow-sm rounded h-10 px-3"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password?.message}
              </span>
            )}
          </div>

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
                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div className="dot absolute w-6 h-6 bg-gray-800 rounded-full shadow -left-1 -top-1 transition"></div>
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
