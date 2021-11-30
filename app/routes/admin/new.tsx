import { useTransition, useActionData, Form, redirect } from 'remix'
import type { ActionFunction } from 'remix'
import invariant from 'tiny-invariant'
import { createPost, NewPost } from '~/post'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const title = formData.get('title')
  const slug = formData.get('slug')
  const markdown = formData.get('markdown')

  const errors = new Set()
  if (!title) errors.add('title')
  if (!slug) errors.add('slug')
  if (!markdown) errors.add('markdown')

  if (errors.size) {
    return errors
  }

  invariant(typeof title === 'string')
  invariant(typeof slug === 'string')
  invariant(typeof markdown === 'string')
  await createPost({ title, slug, markdown })

  return redirect('/admin')
}

export default function NewPost() {
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.title && <em>Slug is required</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea name="markdown" rows={20}></textarea>
      </p>
      <p>
        <button type="submit">
          {transition.submission ? 'Creating...' : 'Create Post'}
        </button>
      </p>
    </Form>
  )
}
