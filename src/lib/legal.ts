// Operator identity, jurisdiction and policy revision date.
//
// Every legal page reads these instead of hard-coding them: the pages used to
// carry template placeholders ([Company Legal Entity Name] and friends) that
// shipped to production unfilled across all twelve documents. Keeping the
// identity in one module means a change of address, or a new revision date, is
// one edit rather than twelve — and a placeholder can only ever be missed once.

export const LEGAL = {
  // Whobela is operated by a sole trader, not a company, so the controller is a
  // natural person: a legal name and a contactable address, with no registration
  // number to give. GDPR Art. 13(1)(a) requires the controller be identifiable,
  // and for a sole trader that identification is the person themselves.
  //
  // TODO(owner): these two strings are the last placeholders on the site.
  // Everything else in /legal is now accurate. Fill them before the next deploy.
  operatorName: "[Your full legal name]",
  operatorAddress: "[Your business address]",

  // Whobela is operated from Poland, so Polish law governs and Warsaw is the
  // forum. Consumer-protection law in the user's own country still applies on
  // top of this where it grants rights that can't be waived — see Terms §13.
  governingLaw: "Poland",
  courts: "the courts of Warsaw, Poland",

  // Rendered as "Last updated" on every policy page. Bump this whenever a
  // document changes materially, and tell users, per Terms §14 / Privacy §12.
  lastUpdated: "9 August 2026",

  supportEmail: "support@whobela.com",
  privacyEmail: "privacy@whobela.com",
} as const;
