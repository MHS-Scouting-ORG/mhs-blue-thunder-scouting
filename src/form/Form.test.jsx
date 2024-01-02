
jest.mock('../api')

import Form from './Form'
import { render }  from '@testing-library/react'
import buildMatchEntry from '../api/builder'


describe('form test', () => {
    it('create test', _ => {
        render(<Form regional="foobar"/>)
    })

    it('test with object', _ => {
        render(<Form regional="regional" matchData={buildMatchEntry("regional", "frc2443", 0)} regional="foobar" />)
    })
})