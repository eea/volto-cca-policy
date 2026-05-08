## RSS middleware customization

This customization patches the `volto-rss-provider` middleware to correctly handle reversed sorting in RSS Listing block queries.

It also fixes image handling so items with small lead images or missing `preview` scales do not break the entire feed; those items remain in the RSS output, but their image enclosure is skipped.