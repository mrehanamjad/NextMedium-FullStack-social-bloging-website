import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function Header() {

  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate();
  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus
    },
    {
      name: 'Signup',
      slug: '/signup',
      active: !authStatus
    },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus
    },
  ]

  return (
    <header className='py-3 bg-white sticky top-0 z-50'>
      <Container>
        <nav className='flex'>
          <div>
            <Link to='/' >
              <Logo width='80px' />
            </Link>
          </div>
          <ul className="hidden md:flex ml-auto ">
            {navItems.map((item) => item.active ? (
              <li key={item.name} >
                <button
                  onClick={() => navigate(item.slug)}  // same as Link
                  className='inline-bock px-4 mx-2 py-2 duration-200 hover:text-blue-700 '
                >
                  {item.name}
                </button>
              </li>
            ) : null)}
             {authStatus && (
              <li>
                <LogoutBtn />
              </li>
             )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header