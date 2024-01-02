import buildMatchEntry, { PriorityOpts, RankingPtsOpts, generateRandomEntry } from './builder'

const checkIfMemberOfProps = function (val, enumVals) {
  let isMember = false
  if(!val || val.length === 0) {
    return true
  }
  for (let i in enumVals) {
    if (Object.hasOwn(enumVals, i)) {
      if (val === enumVals[i]) {
        isMember = true
      }

    }
  }
  return isMember

}

const checkProps = function (possibleVals, enumVals) {
  if (possibleVals.length > 0) {
    possibleVals.forEach(v => {
      expect(checkIfMemberOfProps(v, enumVals)).toBeTruthy()
    })
  }

}

describe('builder object', () => {
  it('test build object', () => {
    expect(buildMatchEntry('', '', '')).not.toBeNull()
  })
  it('validate priority props', () => {
    const matchEntry = generateRandomEntry('', '', '')
    expect(matchEntry.Priorities).toHaveProperty('length')
    checkProps(matchEntry.Priorities, PriorityOpts)
  })

  it('validate ranking props', () => {
    const matchEntry = generateRandomEntry('', '', '')
    expect(matchEntry.RankingPts).toHaveProperty('length')
    checkProps(matchEntry.RankingPts, RankingPtsOpts)
  })

})