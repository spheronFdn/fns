import { FNS } from '../index'
import setup from '../tests/setup'
import { Name } from './getNames'
import { names as wrappedNames } from '../../deploy/00_register_wrapped'

let fnsInstance: FNS

beforeAll(async () => {
  ;({ fnsInstance } = await setup())
})

const testProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).toHaveProperty(property))

const testNotProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).not.toHaveProperty(property))

const letterItems = [
  'w',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  ...Array(5).fill('3'),
  ...Array(11).fill('2'),
  ...Array(11).fill('1'),
  '0',
]

const domainLetterItems = [
  ...Array(3).fill('['),
  'x',
  'w',
  't',
  'l',
  'a',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  ...Array(5).fill('3'),
  ...Array(11).fill('2'),
  ...Array(11).fill('1'),
  '0',
]

describe('getNames', () => {
  let totalRegistrations: number = 0
  let totalOwnedNames: number = 0
  it('should get the registrations for an address', async () => {
    const result = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
    })
    totalRegistrations = result.length
    expect(result).toBeTruthy()
    testProperties(
      result[0],
      'expiryDate',
      'registrationDate',
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'parent',
      'truncatedName',
    )
  })
  it('should get the owned names for an address', async () => {
    const result = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
    })
    totalOwnedNames = result.length
    expect(result).toBeTruthy()
    testProperties(
      result[0],
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'parent',
      'truncatedName',
    )
    testNotProperties(result[0], 'expiryDate', 'registrationDate')
  })
  it('should get wrapped domains for an address', async () => {
    const result = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'wrappedOwner',
    })
    expect(result).toBeTruthy()
    testProperties(
      result[0],
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'parent',
      'truncatedName',
      'expiryDate',
      'fuses',
    )
  })
  it('should get the registrations for an address with pagination', async () => {
    const pageOne = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 0,
    })
    expect(pageOne).toHaveLength(10)
    const pageTwo = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 1,
    })
    expect(pageTwo).toHaveLength(10)
    const pageThree = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 2,
    })
    expect(pageThree).toHaveLength(10)
    const pageFour = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 3,
    })
    expect(pageFour).toHaveLength(totalRegistrations % 10)
  })
  it('should get the owned names for an address with pagination', async () => {
    const pageOne = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 0,
    })
    expect(pageOne).toHaveLength(10)
    const pageTwo = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 1,
    })
    expect(pageTwo).toHaveLength(10)
    const pageThree = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 2,
    })
    expect(pageThree).toHaveLength(10)
    const pageFour = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 3,
    })
    expect(pageFour).toHaveLength(10)
    const pageFive = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 4,
    })
    expect(pageFive).toHaveLength(totalOwnedNames % 10)
  })
  it('should get wrapped domains for an address with pagination, and filter out pcc expired names', async () => {
    const pageOne = await fnsInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'wrappedOwner',
      page: 0,
    })

    const nameCout = wrappedNames.reduce<number>((count, name) => {
      if (name.namedOwner === 'owner2') count += 1
      ;(name.subnames || []).forEach((subname: any) => {
        if (subname.namedOwner === 'owner2') count += 1
      })
      return count
    }, 0)

    // length of page one should be all the names on 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    // minus 1 for the PCC expired name.
    // the result here implies that the PCC expired name is not returned
    expect(pageOne).toHaveLength(nameCout - 1)
  })
  describe('orderBy', () => {
    describe('registrations', () => {
      it('descending registrationDate', async () => {
        const registrationDateOrderedDesc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'registrationDate',
          orderDirection: 'desc',
        })) as Name[]
        registrationDateOrderedDesc.reduce((prev, curr) => {
          expect(prev.registrationDate!.getTime()).toBeGreaterThanOrEqual(
            curr.registrationDate!.getTime(),
          )
          return curr
        })
      })
      it('ascending registrationDate', async () => {
        const registrationDateOrderedAsc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'registrationDate',
          orderDirection: 'asc',
        })) as Name[]
        registrationDateOrderedAsc.reduce((prev, curr) => {
          expect(prev.registrationDate!.getTime()).toBeLessThanOrEqual(
            curr.registrationDate!.getTime(),
          )
          return curr
        })
      })
      it('descending expiryDate', async () => {
        const expiryDateOrderedDesc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'expiryDate',
          orderDirection: 'desc',
        })) as Name[]
        expiryDateOrderedDesc.reduce((prev, curr) => {
          expect(prev.expiryDate!.getTime()).toBeGreaterThanOrEqual(
            curr.expiryDate!.getTime(),
          )
          return curr
        })
      })
      it('ascending expiryDate', async () => {
        const expiryDateOrderedAsc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'expiryDate',
          orderDirection: 'asc',
        })) as Name[]
        expiryDateOrderedAsc.reduce((prev, curr) => {
          expect(prev.expiryDate!.getTime()).toBeLessThanOrEqual(
            curr.expiryDate!.getTime(),
          )
          return curr
        })
      })
      it('descending labelName', async () => {
        const labelNameOrderedDesc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'labelName',
          orderDirection: 'desc',
        })) as Name[]
        expect(labelNameOrderedDesc.map((n) => n.labelName![0])).toStrictEqual(
          letterItems,
        )
      })
      it('ascending labelName', async () => {
        const labelNameOrderedAsc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })) as Name[]
        expect(labelNameOrderedAsc.map((n) => n.labelName![0])).toStrictEqual(
          letterItems.reverse(),
        )
      })
    })
    describe('owned names', () => {
      it('descending createdAt', async () => {
        const createdAtOrderedDesc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        })) as Name[]
        createdAtOrderedDesc.reduce((prev, curr) => {
          expect(prev.createdAt!.getTime()).toBeGreaterThanOrEqual(
            curr.createdAt!.getTime(),
          )
          return curr
        })
      })
      it('ascending createdAt', async () => {
        const createdAtOrderedAsc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'createdAt',
          orderDirection: 'asc',
        })) as Name[]
        createdAtOrderedAsc.reduce((prev, curr) => {
          expect(prev.createdAt!.getTime()).toBeLessThanOrEqual(
            curr.createdAt!.getTime(),
          )
          return curr
        })
      })
      it('descending labelName', async () => {
        const labelNameOrderedDesc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'labelName',
          orderDirection: 'desc',
        })) as Name[]
        expect(labelNameOrderedDesc.map((n) => n.name[0])).toStrictEqual(
          domainLetterItems,
        )
      })
      it('ascending labelName', async () => {
        const labelNameOrderedAsc = (await fnsInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })) as Name[]
        expect(labelNameOrderedAsc.map((n) => n.name[0])).toStrictEqual(
          domainLetterItems.reverse(),
        )
      })
    })
  })
})
