import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Breadcrumbs from '../Breadcrumbs'
import { NavigationProvider } from '@/context/NavigationContext'

describe('Breadcrumbs', () => {
  it('renders dashboard breadcrumb on root path', () => {
    render(
      <BrowserRouter>
        <NavigationProvider>
          <Breadcrumbs />
        </NavigationProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
}) 