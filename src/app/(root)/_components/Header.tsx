import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

async function Header() {

    const user = await currentUser();
  return (
    <div>Header</div>
  )
}

export default Header