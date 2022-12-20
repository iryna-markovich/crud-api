import { run    } from './index'

describe('run', () => {
  it('should run', () => {
    const res = run('ss', 5 )
    expect(res).toEqual({ str: 'ss', num: 5 })
  })
})
