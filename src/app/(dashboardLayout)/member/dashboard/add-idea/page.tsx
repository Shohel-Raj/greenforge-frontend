import { fetchCategoriesAction } from '@/app/_actions/_actions'
import CreateIdeaFormModal from '@/components/shared/form/CreateIdeaFormModal'
import React from 'react'

async function AddIdeaPage() {


  const response = await fetchCategoriesAction();

  const categories = response.success ? response.data : []
  console.log(categories)
  return (
    <CreateIdeaFormModal categories={categories} />
  )
}

export default AddIdeaPage