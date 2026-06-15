import CreateIdeaFormModal from '@/components/shared/form/CreateIdeaFormModal'
import React from 'react'

function AddIdeaPage() {
  const categories = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Health" },
  ];
  return (
    <CreateIdeaFormModal categories={categories} />
  )
}

export default AddIdeaPage