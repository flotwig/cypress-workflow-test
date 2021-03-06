import React from 'react'
import ProjectId from './project-id'
import { mount } from '@cypress/react'
import Collapse, { Panel } from 'rc-collapse'
import '../main.scss'
import ipc from '../lib/ipc'

/* global cy */
describe('ProjectId', () => {
  const project = {
    id: 'fake-project-id',
    configFile: false,
  }

  it('opens and closes', () => {
    const TestProjectId = ({ project }) => (
      <div className='settings-wrapper'>
        <Collapse>
          <Panel header='Project ID' key='project-id' className='form-horizontal settings-project-id'>
            <ProjectId project={project} />
          </Panel>
        </Collapse>
      </div>
    )

    mount(<TestProjectId project={project} />)

    cy.get('[data-cy=project-id]').should('not.exist')
    cy.contains('Project ID').click()
    cy.get('[data-cy=project-id]').should('be.visible').wait(1000)

    cy.contains('Project ID').click()
    cy.get('[data-cy=project-id]').should('not.be.visible')
  })

  it('calls load more', () => {
    cy.stub(ipc, 'externalOpen').as('externalOpen')
    mount(<ProjectId project={project} />, {
      stylesheets: '/__root/dist/app.css',
    })

    cy.contains('a', 'Learn more')
    .click()

    cy.get('@externalOpen').should('have.been.called')
  })

  it('shows a different output when configFile is js', () => {
    mount(<ProjectId project={{ ...project, configFile: 'cypress.config.js' }} />, {
      stylesheets: '/__root/dist/app.css',
    })

    cy.get('[data-cy=project-id] pre').then(($pre) => {
      expect($pre.text()).to.contain('module.exports = ')
    })
  })
})
