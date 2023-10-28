---
title: SSN frustrations
date: "2005-10-03T02:05:53-05:00"
aliases: [/b/3ce1, /b/1A, /p/70]
categories:
  - identity
tags:
  - ssn
  - privacy
  - law
---

Anyone who has known me for very long has probably heard me rant sometime or another about social security numbers, and
if you haven't then here's your chance. It aggravates me to no end how flippant so many individuals and corporations
are about tossing around social security numbers. They either don't realize how potentially dangerous it is, or they
are naive enough to think it could never happen to them. Without going into much detail, suffice it to say that I know
first-hand how easy identity theft is. It was something that happened a long time ago and it's certainly nothing that
I'm proud of, but it does give me a unique perspective on the problem.

### Identifiers versus passwords

The real problem is so obvious and simple that it's almost embarrasing -- it has to do with a confusion between IDs and
passwords. _Authentication_ is the process of proving that you are who you say that you are, and in its simplest form
usually involves two pieces of information -- the identity that you are claiming, and some type of credential that shows
you have the right to claim that identity. A few examples:

- when you check your email, you provide an identity in the form of a username and a credential in the form of a
  password
- secure websites (such as online banking) make use of two certificates for authentication, a public certificate that
  is handed out to assert an identity and a private key that is used to authenticate that assertion
- a post office box has a box number (the identity) and a physical key used to open it (the credential)

In all of these examples, anyone can be aware of your identity without comprising the integrity of that identity. Quite
the contrary, none of these systems would even function if the identity were not made public -- what good is an email
address if you don't tell anyone what it is? How can people send you a package if they don't know your post office box
number? The publicity of the identity is fundamental to the functionality of the system. The real power lies in the
credential, which is designed to be private. You certainly wouldn't give your email password or PO box key to a perfect
stranger or an untrusted authority.

Because one piece of this puzzle _must_ be public and the other piece _must_ be private, it can be very simply concluded
that in order for the system to work these two pieces must be different. Imagine your Internet Provider suddenly
decided to start using your email address as your password also, and therefore gave your private email away to anyone
who simply knew your email address. You've been giving your email address out to friends, printing it on your business
cards, and posting it on your website because it's _supposed_ to be public, but now anyone who has it can access your
email account. Or imagine the Post Office started giving away your mail to anyone that could read the numbers on the
front of your box, key or no key. Pretty scary thought, no? When there is no clear definition between identities and
credentials, the entire security infrastructure caves in on itself.

### A brief history of Social Security Numbers

The Social Security Act was enacted in 1935 under President Franklin Roosevelt. While it did authorize the use of some
method of keeping records, it did not explicity mention SSNs. After considering several possibilities (including
issuing metal dog-tags to every applicant) the Social Security Administration (then called the Social Security Board)
finally decided on a 9 digit number that was handled through local post offices beginning in 1936.

In 1943, an executive order required "All Federal components to use the SSN 'exclusively' whenever the component found
it advisable to set up a new identification system for individuals." That order was followed when the Civil Service
Commission adopted the SSN as an official Federal employee identifier in 1961, and the IRS began using SSN as its
official taxpayer identification number in the following year. For the next ten years, SSN use continued to spread
throughout government and non-government agencies as their official identifier.

Finally in 1971 the Social Security Administration began to see the potential for misuse of SSNs and a task force issued
a report "which proposed that SSA take a 'cautious and conservative' position toward SSN use and do nothing to promote
the use of the SSN as an identifier". The report went mostly unheeded as the Privacy Act of 1975 was then passed to try
and limit governmental use of SSNs. But by then the damage was already done and continuing to worsen.

(Information from Social Security Administration website: <http://www.ssa.gov> )

### It all goes wrong

By this time all kinds of institutions, including hospitals, employers, and banks, were getting SSNs from their patrons
to use as an identifier for their records. While the SSN was never really intended to be used outside of the Social
Security Administration, there was no real immediate harm in doing this since SSNs provided a simple and unique
identification number for every US citizen.

Somewhere along the line however, some organization mistakenly assumed that a person's SSN would only be known by that
individual. When it came time for this organization to verify that a patron was indeed who he claimed to be, they
thought, "well we can just have them verify their SSN which we have on file. Certainly no one else would know this
person's number." I don't know when or where it happened, and I don't know who's brilliant idea it was, but this
decision broke the cardinal rule in authentication -- _An identifier is NOT a credential_.

Today we have SSNs being used as both identifiers and passwords, depending on what organization you are dealing with.
Most employers and colleges use SSN as an ID, while most any bank will ask you to verify your Social Security Number
"for security purposes". I should note that you won't likely find SSNs being used as both identifiers and credentials
within the _same_ organization, but there is no consensus on which is the appropriate use. Going back to our earlier
examples, this would be similar to the Post Office giving your mail to anyone that knew your email address. As far as
the Post Office is concerned, your box number is your identity and your email address is your credential (and should
therefore be kept secret). However, your internet provider uses your email address as an identifier and thus encourages
you to share it with people. To get your mail, a thief would have to know both your PO box number and your email
address - two unrelated tokens, but since they are both public identifiers it would be a trivial task to connect them to
each other.

### 9 minus 5 = the same problem!

Realizing the sensitivity of an individual's SSN, many organizations have truncated it to only use the last four digits.
It seems like a good idea on the surface but it's the exact same problem, only five digits shorter -- the same token is
being used as both an identifier and a credential. However, it's worth mentioning that this truncation does prevent
some types of identity theft, such as opening a fraudulent line of credit which would require the entire SSN.

### What to do now

So how do we deal with SSNs now? Do we treat them as IDs and not worry about who gets them, or do we treat them as
passwords and guard them very carefully? We can't do both. Of course in an ideal world they would have never been used
as passwords to begin with and we wouldn't have this problem. But since the problem _does_ exist, and because of the
sensitivity of data (such as your bank account) that is protected by little more than the last four digits of your SSN,
we must treat them as passwords and guard them as such. As for organizations that use SSN in either capacity, efforts
should be made to do away with it. If SSN is used as an ID, then an alternate number should be used. If SSN is used as
a password, another system needs to be devised to verify a person's identity such as a code word.

There are still organizations that will ask you for you SSN -- don't give it to them! If your college asks for it,
don't give it to them; they can assign you an alternate ID number (though they _will_ legitimately need your SSN if you
get financial aid). If your insurance company uses your SSN as your policy number, demand that they change it. There
is presently no law stating who may and may not ask for your SSN (aside from certain government agencies). However,
there is also no law preventing a company from not doing business with you if you refuse to give it. You can [google
for "ssn privacy"][] to find a lot more information about protecting your SSN.

[google for "ssn privacy"]: http://www.google.com/search?q=ssn+privacy
