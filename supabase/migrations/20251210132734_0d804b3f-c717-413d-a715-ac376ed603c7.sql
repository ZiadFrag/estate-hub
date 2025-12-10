
-- Drop all existing RLS policies to recreate them properly

-- Drop policies on properties
DROP POLICY IF EXISTS "Admins can manage properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can manage properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;

-- Drop policies on owners
DROP POLICY IF EXISTS "Admins can manage owners" ON public.owners;
DROP POLICY IF EXISTS "Owners can update own record" ON public.owners;
DROP POLICY IF EXISTS "Owners can view own record" ON public.owners;

-- Drop policies on agents
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;
DROP POLICY IF EXISTS "Agents can update own record" ON public.agents;
DROP POLICY IF EXISTS "Anyone can view agents" ON public.agents;

-- Drop policies on clients
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Agents can view clients" ON public.agents;
DROP POLICY IF EXISTS "Clients can update own record" ON public.clients;
DROP POLICY IF EXISTS "Clients can view own record" ON public.clients;

-- Drop policies on contracts
DROP POLICY IF EXISTS "Admins can manage contracts" ON public.contracts;
DROP POLICY IF EXISTS "Agents can view all contracts" ON public.contracts;
DROP POLICY IF EXISTS "Clients can view own contracts" ON public.contracts;

-- Drop policies on payments
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Agents can view payments" ON public.payments;

-- Drop policies on listings
DROP POLICY IF EXISTS "Admins can manage listings" ON public.listings;
DROP POLICY IF EXISTS "Agents can manage listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;

-- Drop policies on property_visits
DROP POLICY IF EXISTS "Admins can manage visits" ON public.property_visits;
DROP POLICY IF EXISTS "Agents can manage visits" ON public.property_visits;
DROP POLICY IF EXISTS "Clients can view own visits" ON public.property_visits;

-- Drop policies on branches
DROP POLICY IF EXISTS "Admins can manage branches" ON public.branches;
DROP POLICY IF EXISTS "Anyone can view branches" ON public.branches;

-- Drop policies on departments
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
DROP POLICY IF EXISTS "Anyone can view departments" ON public.departments;

-- Drop policies on property_owners
DROP POLICY IF EXISTS "Admins can manage property_owners" ON public.property_owners;
DROP POLICY IF EXISTS "Anyone can view property_owners" ON public.property_owners;

-- ============================================
-- PROPERTIES TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on properties"
ON public.properties FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Owner: SELECT their own properties only
CREATE POLICY "Owner can view own properties"
ON public.properties FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.property_owners po
    JOIN public.owners o ON po.owner_id = o.id
    WHERE po.property_id = properties.id AND o.user_id = auth.uid()
  )
);

-- Owner: INSERT new properties
CREATE POLICY "Owner can insert properties"
ON public.properties FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Owner: UPDATE their own properties
CREATE POLICY "Owner can update own properties"
ON public.properties FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.property_owners po
    JOIN public.owners o ON po.owner_id = o.id
    WHERE po.property_id = properties.id AND o.user_id = auth.uid()
  )
);

-- Owner: DELETE their own properties
CREATE POLICY "Owner can delete own properties"
ON public.properties FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.property_owners po
    JOIN public.owners o ON po.owner_id = o.id
    WHERE po.property_id = properties.id AND o.user_id = auth.uid()
  )
);

-- Agent: SELECT only
CREATE POLICY "Agent can view all properties"
ON public.properties FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- Client: SELECT only
CREATE POLICY "Client can view all properties"
ON public.properties FOR SELECT
USING (public.has_role(auth.uid(), 'client'));

-- ============================================
-- OWNERS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on owners"
ON public.owners FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Owner: SELECT own record
CREATE POLICY "Owner can view own record"
ON public.owners FOR SELECT
USING (auth.uid() = user_id);

-- Owner: UPDATE own record
CREATE POLICY "Owner can update own record"
ON public.owners FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- AGENTS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on agents"
ON public.agents FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Agent: SELECT all agents (for directory)
CREATE POLICY "Agent can view all agents"
ON public.agents FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- Agent: UPDATE own record only
CREATE POLICY "Agent can update own record"
ON public.agents FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- CLIENTS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on clients"
ON public.clients FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Agent: SELECT only (view clients)
CREATE POLICY "Agent can view clients"
ON public.clients FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- Client: SELECT own record
CREATE POLICY "Client can view own record"
ON public.clients FOR SELECT
USING (auth.uid() = user_id);

-- Client: UPDATE own record
CREATE POLICY "Client can update own record"
ON public.clients FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- CONTRACTS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on contracts"
ON public.contracts FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Agent: SELECT only
CREATE POLICY "Agent can view contracts"
ON public.contracts FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- Client: SELECT own contracts
CREATE POLICY "Client can view own contracts"
ON public.contracts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = contracts.client_id AND c.user_id = auth.uid()
  )
);

-- ============================================
-- PAYMENTS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on payments"
ON public.payments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Agent: SELECT only
CREATE POLICY "Agent can view payments"
ON public.payments FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- ============================================
-- LISTINGS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on listings"
ON public.listings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Owner: SELECT only their property listings
CREATE POLICY "Owner can view own property listings"
ON public.listings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.property_owners po
    JOIN public.owners o ON po.owner_id = o.id
    WHERE po.property_id = listings.property_id AND o.user_id = auth.uid()
  )
);

-- Agent: SELECT all listings
CREATE POLICY "Agent can view all listings"
ON public.listings FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- Agent: INSERT new listings
CREATE POLICY "Agent can insert listings"
ON public.listings FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'agent'));

-- Agent: UPDATE own listings only
CREATE POLICY "Agent can update own listings"
ON public.listings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.agents a
    WHERE a.id = listings.agent_id AND a.user_id = auth.uid()
  )
);

-- Client: SELECT all active listings
CREATE POLICY "Client can view active listings"
ON public.listings FOR SELECT
USING (public.has_role(auth.uid(), 'client') AND status = 'active');

-- ============================================
-- PROPERTY_VISITS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on property_visits"
ON public.property_visits FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Owner: SELECT visits for their properties only
CREATE POLICY "Owner can view visits on own properties"
ON public.property_visits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.property_owners po
    JOIN public.owners o ON po.owner_id = o.id
    WHERE po.property_id = property_visits.property_id AND o.user_id = auth.uid()
  )
);

-- Agent: SELECT own visits
CREATE POLICY "Agent can view own visits"
ON public.property_visits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.agents a
    WHERE a.id = property_visits.agent_id AND a.user_id = auth.uid()
  )
);

-- Agent: INSERT new visits
CREATE POLICY "Agent can insert visits"
ON public.property_visits FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'agent'));

-- Agent: UPDATE own visits (notes only conceptually, but full update allowed)
CREATE POLICY "Agent can update own visits"
ON public.property_visits FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.agents a
    WHERE a.id = property_visits.agent_id AND a.user_id = auth.uid()
  )
);

-- Client: SELECT own visits
CREATE POLICY "Client can view own visits"
ON public.property_visits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = property_visits.client_id AND c.user_id = auth.uid()
  )
);

-- ============================================
-- BRANCHES TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on branches"
ON public.branches FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can view branches (public info)
CREATE POLICY "Anyone can view branches"
ON public.branches FOR SELECT
USING (true);

-- ============================================
-- DEPARTMENTS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on departments"
ON public.departments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can view departments (public info)
CREATE POLICY "Anyone can view departments"
ON public.departments FOR SELECT
USING (true);

-- ============================================
-- PROPERTY_OWNERS TABLE POLICIES
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access on property_owners"
ON public.property_owners FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Owner: Can view and manage their own property links
CREATE POLICY "Owner can view own property_owners"
ON public.property_owners FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.owners o
    WHERE o.id = property_owners.owner_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Owner can insert property_owners"
ON public.property_owners FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.owners o
    WHERE o.id = property_owners.owner_id AND o.user_id = auth.uid()
  )
);
