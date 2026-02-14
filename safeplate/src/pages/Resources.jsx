import { CRISIS_RESOURCES, ORGANIZATION_LINKS } from '../utils/constants'

export default function Resources() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-darkgray mb-8">Crisis & Support Resources</h1>

      <div className="card bg-primary/10 border-2 border-primary mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl">Talk to Someone Now</h2>
          <p className="text-base-content/80">
            These resources are available 24/7. You don't have to face this alone.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <a
              href={CRISIS_RESOURCES.neda.tel}
              className="btn btn-primary btn-lg bg-sage border-sage hover:bg-sage/90"
            >
              📞 NEDA: {CRISIS_RESOURCES.neda.phone}
            </a>
            <a
              href={CRISIS_RESOURCES.crisisText.sms}
              className="btn btn-primary btn-lg bg-sage border-sage hover:bg-sage/90"
            >
              💬 Text NEDA to 741741
            </a>
            <a
              href={CRISIS_RESOURCES.suicideLifeline.tel}
              className="btn btn-primary btn-lg bg-sage border-sage hover:bg-sage/90"
            >
              📞 988 Lifeline
            </a>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Organizations</h2>
        <div className="grid gap-4">
          {ORGANIZATION_LINKS.map((org) => (
            <a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <h3 className="card-title text-lg">{org.name}</h3>
                <p className="text-sm text-base-content/80">{org.description}</p>
                <span className="link link-primary text-sm">Visit website →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Understanding Eating Disorders</h2>
        <p className="text-base-content/80 mb-4">
          Eating disorders are serious mental health conditions. Recovery is possible with the right support. 
          Learn more about signs, treatment options, and how to support yourself or a loved one.
        </p>
        <a
          href="https://www.nationaleatingdisorders.org/learn"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          NEDA - Learn About Eating Disorders →
        </a>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Supporting a Loved One</h2>
        <p className="text-base-content/80 mb-4">
          If someone you care about is struggling, your support matters. Here's how to help.
        </p>
        <a
          href="https://www.nationaleatingdisorders.org/learn/help/caregivers"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          NEDA - Caregiver Resources →
        </a>
      </section>

      <div className="alert alert-warning">
        <div>
          <h3 className="font-bold">Disclaimer</h3>
          <p className="text-sm">
            SafePlate is not a substitute for professional medical care. If you are in crisis, 
            please contact emergency services or one of the hotlines above.
          </p>
        </div>
      </div>
    </div>
  )
}
