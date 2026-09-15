const clothingSizes = [
  { age: '0-3 Months', height: '50-62 cm', chest: '40-42 cm', waist: '38-40 cm' },
  { age: '3-12 Months', height: '62-80 cm', chest: '42-46 cm', waist: '40-44 cm' },
  { age: '1-3 Years', height: '80-98 cm', chest: '48-52 cm', waist: '46-50 cm' },
  { age: '4-7 Years', height: '98-128 cm', chest: '54-60 cm', waist: '52-56 cm' },
  { age: '8-12 Years', height: '128-152 cm', chest: '62-70 cm', waist: '58-64 cm' },
  { age: '13-16 Years', height: '152-170 cm', chest: '72-84 cm', waist: '66-76 cm' },
]

const footwearSizes = [
  { india: '6', eu: '23', us: '7', cm: '14.5' },
  { india: '7', eu: '24', us: '8', cm: '15.2' },
  { india: '8', eu: '25', us: '9', cm: '15.9' },
  { india: '9', eu: '27', us: '10', cm: '16.7' },
  { india: '10', eu: '28', us: '11', cm: '17.4' },
  { india: '11', eu: '29', us: '12', cm: '18.2' },
  { india: '12', eu: '31', us: '13', cm: '19.5' },
  { india: '13', eu: '32', us: '1', cm: '20.2' },
  { india: '1', eu: '33', us: '2', cm: '20.9' },
  { india: '2', eu: '34', us: '3', cm: '21.6' },
]

export function SizeGuidePage() {
  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-8">Size Guide</h1>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">Clothing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-ink-900/15">
                <th className="py-2 pr-4">Age</th>
                <th className="py-2 pr-4">Height</th>
                <th className="py-2 pr-4">Chest</th>
                <th className="py-2 pr-4">Waist</th>
              </tr>
            </thead>
            <tbody>
              {clothingSizes.map((row) => (
                <tr key={row.age} className="border-b border-ink-900/8">
                  <td className="py-2 pr-4 font-medium">{row.age}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.height}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.chest}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">Footwear</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-ink-900/15">
                <th className="py-2 pr-4">India/UK</th>
                <th className="py-2 pr-4">EU</th>
                <th className="py-2 pr-4">US</th>
                <th className="py-2 pr-4">Foot Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              {footwearSizes.map((row) => (
                <tr key={row.india} className="border-b border-ink-900/8">
                  <td className="py-2 pr-4 font-medium tabular-nums">{row.india}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.eu}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.us}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">
          How to Measure
        </h2>
        <ul className="list-disc list-inside text-sm text-ink-600 flex flex-col gap-1">
          <li>Height: Measure from the top of the head to the floor, without shoes.</li>
          <li>Chest: Measure around the fullest part of the chest, under the arms.</li>
          <li>Waist: Measure around the natural waistline.</li>
          <li>Foot length: Measure from heel to the longest toe while standing.</li>
        </ul>
      </section>
    </div>
  )
}
