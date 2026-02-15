import { CRISIS_RESOURCES, ORGANIZATION_LINKS } from '../utils/constants'
import ResourceActionButton from '../components/ResourceActionButton'
import ResourceCard from '../components/ResourceCard'
import ResourceGrid from '../components/ResourceGrid'
import SectionHeader from '../components/SectionHeader'

export default function Resources() {
  const orgTags = {
    'National Eating Disorders Association (NEDA)': ['Support', 'Referrals'],
    'Project HEAL': ['Access', 'Guidance'],
    'The Emily Program': ['Treatment', 'Recovery'],
    'ANAD (National Association of Anorexia Nervosa)': ['Peer support', 'Education'],
  }

  return (
    <main className="sp-resources-page" aria-labelledby="resources-title">
      <div className="sp-resources-shell">
        <header className="sp-resources-hero">
          <h1 id="resources-title">Crisis &amp; Support Resources</h1>
          <p>
            Immediate support and trusted guidance, organized to help you take the next step with clarity.
          </p>
        </header>

        <nav className="sp-resources-quick-nav" aria-label="Resources quick navigation">
          <a href="#reach-support">Reach support now</a>
          <a href="#organizations">Organizations</a>
          <a href="#understanding">Understanding</a>
          <a href="#supporting-loved-one">Supporting a loved one</a>
        </nav>

        <ResourceCard as="section" id="reach-support" className="sp-reach-support-card" aria-labelledby="reach-support-heading">
          <SectionHeader
            id="reach-support-heading"
            title="Reach support now"
            subtitle="These services are available every day. You are not alone in this moment."
            className="sp-resource-section-header"
          />

          <div className="sp-resource-actions" role="list" aria-label="Immediate support actions">
            <ResourceActionButton
              icon="📞"
              title="Call NEDA"
              subtext={CRISIS_RESOURCES.neda.phone}
              href={CRISIS_RESOURCES.neda.tel}
            />
            <ResourceActionButton
              icon="💬"
              title="Text NEDA"
              subtext="NEDA to 741741"
              href={CRISIS_RESOURCES.crisisText.sms}
            />
            <ResourceActionButton
              icon="📱"
              title="988 Lifeline"
              subtext="Call or text 988"
              href={CRISIS_RESOURCES.suicideLifeline.tel}
            />
          </div>

          <p className="sp-resource-helper-text">
            If you are in immediate danger, call local emergency services.
          </p>
        </ResourceCard>

        <section id="organizations" aria-labelledby="organizations-heading" className="sp-resource-section">
          <SectionHeader
            id="organizations-heading"
            title="Organizations"
            subtitle="Explore trusted groups for treatment access, practical support, and recovery guidance."
            className="sp-resource-section-header"
          />

          <ResourceGrid>
            {ORGANIZATION_LINKS.map((org) => (
              <li key={org.name} className="sp-resource-grid-item">
                <ResourceCard className="sp-resource-org-card">
                  <h3>{org.name}</h3>
                  <p>{org.description}.</p>
                  {orgTags[org.name]?.length > 0 && (
                    <ul className="sp-resource-tags" aria-label={`What ${org.name} helps with`}>
                      {orgTags[org.name].map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sp-resource-link"
                    aria-label={`Visit website for ${org.name}`}
                  >
                    Visit website →
                  </a>
                </ResourceCard>
              </li>
            ))}
          </ResourceGrid>
        </section>

        <section className="sp-resource-section" aria-label="Educational resources">
          <SectionHeader
            id="understanding"
            title="Understanding Eating Disorders"
            subtitle="Clear, supportive information about warning signs, treatment, and recovery."
            className="sp-resource-section-header"
          />

          <ResourceCard className="sp-education-card">
            <p>
              Eating disorders are serious and treatable mental health conditions.
              Learning about signs, treatment options, and early support can make recovery feel more manageable.
            </p>
            <a
              href="https://www.nationaleatingdisorders.org/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary sp-education-link"
              aria-label="Learn more about understanding eating disorders"
            >
              Learn more
            </a>
          </ResourceCard>

          <SectionHeader
            id="supporting-loved-one"
            title="Supporting a Loved One"
            subtitle="Practical guidance for showing care while encouraging professional help."
            className="sp-resource-section-header sp-resource-section-header--divider"
          />

          <ResourceCard className="sp-education-card">
            <p>
              If someone you care about is struggling, calm and consistent support can make a difference.
              Helpful tools can guide conversations, boundaries, and next steps.
            </p>
            <a
              href="https://www.nationaleatingdisorders.org/learn/help/caregivers"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary sp-education-link"
              aria-label="Learn more about supporting a loved one"
            >
              Learn more
            </a>
          </ResourceCard>
        </section>

        <div className="sp-resource-disclaimer" role="note" aria-label="Disclaimer">
          <h3>Disclaimer</h3>
          <p>
            SafePlate is not a substitute for professional medical care. If you are in crisis,
            please contact emergency services or one of the hotlines above.
          </p>
        </div>
      </div>
    </main>
  )
}
