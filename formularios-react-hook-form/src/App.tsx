import './styles/global.css'
import './style.css'
import { PlusCircle, XCircle } from 'lucide-react'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from './components/Form'

// const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5mb
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp',
// ]

const createUserFormSchema = z.object({
  // avatar: z
  //   .instanceof(FileList)
  //   .refine((files) => !!files.item(0), 'A imagem de perfil é obrigatória')
  //   .refine(
  //     (files) => files.item(0)!.size <= MAX_FILE_SIZE,
  //     `Tamanho máximo de 5MB`,
  //   )
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files.item(0)!.type),
  //     'Formato de imagem inválido',
  //   )
  //   .transform((files) => {
  //     return files.item(0)!
  //   }),
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
      }),
    )
    .min(2, 'Insira pelo menos 2 tecnologias'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export default function App() {
  const [output, setOutput] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const createUseForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
  } = createUseForm

  const userPassword = watch('password')
  const isPasswordStrong =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
      userPassword,
    )

  const { fields, append, remove } = useFieldArray({
    name: 'techs',
    control,
  })
  function addNewTech() {
    append({
      title: '',
    })
  }

  const handleToogleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked)
  }
  async function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2))
  }
  return (
    <>
      <main
        className={`h-screen ${
          darkMode ? 'bg-zinc-900 text-zinc-300' : 'bg-zync-50'
        } flex flex-col items-center justify-center`}
      >
        <FormProvider {...createUseForm}>
          <form
            onSubmit={handleSubmit(createUser)}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            {/* <Form.Field>
              <Form.Label htmlFor="avatar">Avatar</Form.Label>
              <Form.Input type="file" name="avatar" />
              <Form.ErrorMessage field="avatar" />
            </Form.Field> */}

            <Form.Field>
              <Form.Label htmlFor="name">Nome</Form.Label>
              <Form.Input type="name" name="name" />
              <Form.ErrorMessage field="name" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <Form.Input type="email" name="email" />
              <Form.ErrorMessage field="email" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="password">
                Password
                {isPasswordStrong ? (
                  <span className="text-xs text-emerald-600">Senha forte</span>
                ) : (
                  <span className="text-xs text-red-500">Senha fraca</span>
                )}
              </Form.Label>
              <Form.Input type="password" name="password" />
              <Form.ErrorMessage field="password" />
            </Form.Field>
            <Form.Field>
              <Form.Label>
                Tecnologias
                <button
                  type="button"
                  onClick={addNewTech}
                  className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
                >
                  Adicionar nova
                  <PlusCircle size={14} />
                </button>
              </Form.Label>
              <Form.ErrorMessage field="techs" />

              {fields.map((field, index) => {
                const fieldName = `techs.${index}.title`

                return (
                  <Form.Field key={field.id}>
                    <div className="flex gap-2 items-center">
                      <Form.Input type={fieldName} name={fieldName} />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                    <Form.ErrorMessage field={fieldName} />
                  </Form.Field>
                )
              })}
            </Form.Field>

            <button
              type="submit"
              disabled={isSubmitting}
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
                <div className="ml-3 text-gray-700 font-medium">
                  Modo escuro
                </div>
              </label>
            </div>
          </form>
        </FormProvider>
        <pre>{output}</pre>
      </main>
    </>
  )
}
